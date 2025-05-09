// src/whatsapp/whatsapp.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ComplaintService } from 'src/complaint/complaint.service';
const venom = require('venom-bot');

interface UserState {
    step: number;
}

@Injectable()
export class ChatbotService implements OnModuleInit {
    constructor(private readonly complaintService: ComplaintService) {}
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
            const msg = message.body.toLowerCase();

            if (!this.userStates[userId]) {
                this.userStates[userId] = { step: 0 };
            }

            const user = this.userStates[userId];

            if (user.step === 0) {
                const cadastrado = await this.checkRegister(userId);
                if (!cadastrado) { //nao tiver cadastrado
                    await client.sendText(userId, `Olá! Você não está cadastrado no Conecta Recife. 
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
                user.step = 1;
                return;
            }

            if (user.step === 1) {
                if (msg.includes('1') || msg.includes('denunciar') || msg.includes('denuncia') || msg.includes('descarte')) {
                    await client.sendText(
                        userId,
                        `Para registrar sua denúncia, precisamos da localização exata do descarte irregular. Você pode nos enviar sua localização atual pelo whatsapp.
                Caso deseje voltar ao menu digite 0.`
                    );
                    user.step = 5;
                    return
                } else if (msg.includes('0')) {
                    await this.backToMenu(client, userId, user);
                }
                else {
                    await client.sendText(userId, `Operação inválida. Digite 1 para continuar a denúncia ou 0 para voltar ao menu.`);
                    user.step = 1;
                }
                return;
            }

            if (user.step === 2) {
                if (messageType === 'location') {
                    const { lat, lng } = message;

                    await client.sendText(userId, `📍 Localização recebida. Coordenadas de ${lat} (latitude) e ${lng} (longitude).
            Para prosseguir com a denúncia, por favor, nos envie uma foto do local com descarte irregular.`);
                    user.step = 7;
                } else if (msg.includes('0') && messageType !== 'location') {
                    await this.backToMenu(client, userId, user);
                    return;
                }
                else {
                    await client.sendText(userId, '⛔ Você não enviou a localização! Tente novamente ou digite 0 para voltar ao menu.');
                    user.step = 2;
                    return;
                }
            }

            if (user.step === 3) {
                await client.sendText(userId, `Parabéns, atualmente você possui 150 capibas. Quer aproveitar melhor os diversos benefícios obtidos pelo capiba? Se informe melhor no site www.conectarecife.com/capiba`);
                user.step = 0;
                return;
            }

            if (user.step === 4) {
                await client.sendText(userId, `Para informações diversas, acesse nosso site: www.conectarecife.com.br/recolhe`);
                user.step = 0;
                return;
            }

            if (user.step === 5) {
                if (messageType === 'location') {
                    const { lat, lng } = message;

                    await client.sendText(userId, `📍 Localização recebida. Coordenadas de ${lat} (latitude) e ${lng} (longitude).
            Para prosseguir com a denúncia, por favor, nos envie uma foto do local com descarte irregular.`);
                    user.step = 6;
                } else if (msg.includes('0') && messageType !== 'location') {
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
                if (messageType === 'image') {
                    await client.sendText(userId, '📸 Processando imagem...');
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    const imageBase64 = message.body;
                    const mimetype = message.mimetype;
                    await client.sendText(userId, `📸 Imagem recebida com sucesso! Agradecemos sua colaboração. Saiba que sua denúncia foi registrada com sucesso. Você receberá notificações sobre o andamento.
            Você será redirecionado ao menu, obrigado.`);
                    await this.backToMenu(client, userId, user);
                    user.step = 0;
                    return;
                } else if (msg.includes('0') && messageType !== 'image') {
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
                await client.sendText(userId, 'Procurando local mais próximo... 📍');
                await new Promise(resolve => setTimeout(resolve, 2000));
                await client.sendText(userId, `Centro de Artes e Comunicação da federal! 📍`);
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
