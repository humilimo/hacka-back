// src/whatsapp/whatsapp.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ComplaintService } from 'src/complaint/complaint.service';
import { UserState } from '../../types/userState.type';
import { getStorage } from 'firebase-admin/storage';
import { UsersService } from 'src/users/users.service';
import { DumpsterService } from 'src/dumpster/dumpster.service';
const venom = require('venom-bot');

@Injectable()
export class ChatbotService implements OnModuleInit {
    constructor(
        private readonly complaintService: ComplaintService,
        private readonly usersService: UsersService,
        private readonly dumpsterService: DumpsterService,
    ) {}
    private userStates: Record<string, UserState> = {};

    async onModuleInit() {
        venom
            .create({
                session: 'conecta-recife',
                headless: false,
                browserArgs: ['--disable-gpu'],
                useChrome: true,
                executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe'
            })
            .then((client) => this.start(client))
            .catch((erro) => console.log(erro));
    }

    private async start(client: any) {
        client.onMessage(async (message: any) => {
            if (message.isGroupMsg) return;

            const userId = message.from;
            
            const messageType = message.type;
            console.log(messageType)
            const msg = message.body.toLowerCase();

            if (!this.userStates[userId]) {
                this.userStates[userId] = { step: 0 };
            }

            const user = this.userStates[userId];
            console.log('userID e step', userId, user.step);

            if (user.step === 0) {
                const cadastrado = await this.checkRegister(userId);
                if (!cadastrado) { //nao tiver cadastrado
                    await client.sendText(userId, 
                        `Olá! Você não está cadastrado no Conecta Recife.
                        Visite www.google.com.br para se conectar ao serviço, e falo comigo novamente! :)`);
                    user.step = 0;
                    return;
                }
                await client.sendText(userId,
                    `Bem-vindo(a)! Esse é o nosso sistema de atendimento do ReColhe.
Confira as opções abaixo e escolha a que melhor atende à sua necessidade:
1️⃣ Denunciar descarte irregular de resíduos
2️⃣ Encontrar pontos de descarte reciclável próximo
3️⃣ Verificar saldo
4️⃣ Dúvidas`);
                user.step = 100;
                return;
            }

            if (user.step === 1 || msg === '1') {
                if (msg === '1') {
                    await client.sendText(
                        userId,
                        `Para registrar sua denúncia, precisamos da localização exata do descarte irregular. Você pode nos enviar sua localização atual pelo whatsapp.
                Caso deseje voltar ao menu digite 0.`
                    );
                    user.step = 5;
                    return
                } else if (msg === '0') {
                    await this.backToMenu(client, userId, user);
                }
                else {
                    await client.sendText(userId, `Operação inválida. Digite 1 para continuar a denúncia ou 0 para voltar ao menu.`);
                    user.step = 1;
                }
                return;
            }

            if (user.step === 2 || msg === '2') {
                if ( msg === '2') {
                    await client.sendText(userId, `Por favor nos envie sua localização atual para que possamos localizar os pontos de coleta mais próximos.`);
                    user.step = 7;
                    return;
                } else if (msg === '0' && messageType !== 'chat') {
                    await this.backToMenu(client, userId, user);
                    return;
                }
                else {
                    await client.sendText(userId, '⛔ Você não enviou a localização! Tente novamente ou digite 0 para voltar ao menu.');
                    user.step = 2;
                    return;
                }
            }

            if (user.step === 3 || msg === '3') {
                const { balance, pendingBalance } = await this.usersService.getUserBalanceByPhone(userId.replace(/^55/, '').replace(/@c\.us$/, ''));
                await client.sendText(userId, 
                    `Parabéns, você possui ${balance} capibas. Atualmente, você possui ${pendingBalance} capibas pendentes.
                Quer aproveitar melhor os diversos benefícios obtidos pelo capiba? Se informe melhor no site www.conectarecife.com/capiba`);
                user.step = 0;
                return;
            }

            if (user.step === 4 || msg === '4') {
                await client.sendText(userId, `Para informações diversas, acesse nosso site: www.conectarecife.com.br/recolhe`);
                user.step = 0;
                return;
            }

            if (user.step === 5) { //localizacao da denuncia
                if (messageType === 'location') {
                    const { lat, lng } = message;
                    user.latitude = lat
                    user.longitude = lng
                    await client.sendText(userId, 
                        `📍 Localização recebida. Coordenadas de ${lat} (latitude) e ${lng} (longitude).
                        Para prosseguir com a denúncia, por favor, nos envie uma foto do local com descarte irregular.`);
                    user.step = 6;
                } else if (msg === '0' && messageType !== 'location') {
                    await this.backToMenu(client, userId, user);
                    user.step = 0;
                    return;
                }
                else {
                    await client.sendText(userId, 'Você não enviou a localização! ⛔, tente novamente ou digite 0 para voltar ao menu!');
                    user.step = 2;
                    return;
                }
                user.step = 6;
                return;
            }

            if (user.step === 6) {
                if (messageType === 'image') { //salvar foto
                    await client.sendText(userId, '📸 Processando imagem...');
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    const imageBase64 = message.body;
                    const imageBuffer = Buffer.from(imageBase64, 'base64');
                    const address = await this.complaintService.reverseGeocode(user.latitude!.toString(), user.longitude!.toString());
                    const userNumber = userId.replace(/^55/, '').replace(/@c\.us$/, '');
                    await client.sendText(userId, 
                        `📸 Imagem recebida com sucesso! Agradecemos sua colaboração. Saiba que sua denúncia foi registrada com sucesso. 
                        Você receberá notificações sobre o andamento. Você será redirecionado ao menu, obrigado.`);
                    await this.complaintService.createComplaint({address,
                        createdAt: new Date(),
                        latitude: user.latitude!,
                        longitude: user.longitude!,
                        approved: false,
                        approvedAt: new Date(),
                        userPhoneNumber: userNumber,
                    })
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    await this.backToMenu(client, userId, user);
                    user.step = 0;
                    return;
                } else if (msg === '0' && messageType !== 'image') {
                    await this.backToMenu(client, userId, user);
                    user.step = 0;
                    return;
                }
                else {
                    await client.sendText(userId, 'Você não enviou uma imagem válida! ⛔, tente novamente ou digite 0 para voltar ao menu!');
                    user.step = 6;
                    return;
                }
            }

            if (user.step === 7) {
                console.log("to no stop")
                if (messageType === 'location') {
                    const { lat, lng } = message;
                    user.latitude = lat
                    user.longitude = lng
                    await client.sendText(userId, `📍 Localização recebida. Coordenadas de ${lat} (latitude) e ${lng} (longitude).`);
                    user.step = 8;
                } else if (msg === '0' && messageType !== 'location') {
                    await this.backToMenu(client, userId, user);
                    return;
                }
                else {
                    await client.sendText(userId, '⛔ Você não enviou a localização! Tente novamente ou digite 0 para voltar ao menu.');
                    user.step = 7;
                    return;
                }
            }

            if (user.step === 8) {
                await client.sendText(userId, 'Procurando local mais próximo... 📍');
                await new Promise(resolve => setTimeout(resolve, 2000));
                const dumpsters = await this.dumpsterService.getNearbyDumpsters(user.latitude!, user.longitude!);
                console.log(dumpsters);
                if (dumpsters.length === 0) {
                    await client.sendText(userId, 'Desculpe, não encontramos pontos de descarte reciclável em um raio de 5 km.');
                    await this.backToMenu(client, userId, user);
                    return;
                }
                await client.sendText(userId, `Encontramos os seguintes pontos de descarte reciclável próximos: 
                    ${dumpsters.map(dumpster => `- ${dumpster.address} | (${dumpster.tiporesiduo})`).join('\n')}`);
                await new Promise(resolve => setTimeout(resolve, 1500));
                await this.backToMenu(client, userId, user);
            }
        });
    }

    private async backToMenu(client: any, userId: string, user: UserState) {
        await client.sendText(userId,
            `Bem-vindo(a)! Esse é o nosso sistema de atendimento do ReColhe.
Confira as opções abaixo e escolha a que melhor atende à sua necessidade:
1️⃣ Denunciar descarte irregular de resíduos
2️⃣ Encontrar pontos de descarte reciclável próximo
3️⃣ Verificar saldo
4️⃣ Dúvidas`
        );
        user.step = 0;
    }

    private async checkRegister(userId: string): Promise<boolean> {
        // Aqui você vai futuramente consultar banco de dados ou API
        // Por enquanto, vamos simular:
        return userId.endsWith('@c.us'); // Apenas para simular verdadeiro
    }
}
