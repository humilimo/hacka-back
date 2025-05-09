// src/whatsapp/whatsapp.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
const venom = require('venom-bot');

interface UserState {
  step: number;
}

@Injectable()
export class ChatbotService implements OnModuleInit {
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
      const msg = message.body.toLowerCase();

      if (!this.userStates[userId]) {
        this.userStates[userId] = { step: 0 };
      }

      const user = this.userStates[userId];

      if (user.step === 0) {
        const cadastrado = await this.verificarCadastro(userId);
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
                📍`
              );
              await new Promise(resolve => setTimeout(resolve, 4000));
              if (message.type === 'location') {
                const latitude = message.lat;
                const longitude = message.lng;
              
                await client.sendText(userId, `📍 Localização recebida. 
                Para prosseguir com a denúncia, por favor, nos envie uma foto local de descarte irregular.`);
                if (message.type === 'image') {
                    await client.sendText(userId, '📸 Imagem recebida com sucesso! Você será redirecionado ao menu, obrigado.');
                } else {
                    await client.sendText(
                        userId,
                        `Você não enviou a localização. Tente novamente.`
                      );
                    user.step = 0
                  }
                return;
              } else {
                await client.sendText(
                    userId,
                    `Você não enviou a localização. Tente novamente.`
                  );
                user.step = 0
              }
        }
        return;
      }

    //   if (user.step === 2) {
    //     await new Promise(resolve => setTimeout(resolve, 2000));
    //     if (msg.includes('desafios mensais') || msg.includes('1')) {
    //       await client.sendText(userId,
    //         'Quer ver os Desafios Mensais que estão dando o dobro de capibas?\n\n' +
    //         '🗓 *Tarefas Mensais* \n💰 Capibas em dobro 💰\n\n' +
    //         '✅ Participar de aulas no Compaz / Academia Recife\n👉 *Meta:* 2x por semana!\n\n' +
    //         '✅ Doar sangue nas campanhas apoiadas pelo Conecta Recife\n👉 Salvar vidas tá na lista! 🩸\n\n' +
    //         '✅ Fazer atualização da carteira vacinal\n👉 Saúde em dia, bora lá! 💉\n\n' +
    //         '✅ Adotar um Pet usando Adota Pet do Conecta Recife\n👉 Novo amigo de quatro patas esperando! 🐶🐱\n\n' +
    //         '✅ Levar seu pet para castração ou atualização da carteira vacinal\n👉 Cuidar da saúde do bichinho também é amor! 🐾'
    //       );
    //       await new Promise(resolve => setTimeout(resolve, 3000));
    //       await this.voltarAoMenuPrincipal(client, userId, user);
    //     } else if (msg.includes('validar') || msg.includes('2')) {
    //       await client.sendText(userId, 'Que bom que você cumpriu um desafio!\n\nEscolha uma das categorias:\n\n1️⃣ 🦁 *Animais*\n2️⃣ 📝 *Cidadania*\n3️⃣ 🚲 *Mobilidade*\n4️⃣ 💚 *Saúde e bem estar*\n5️⃣ 🌳 *Meio ambiente*');
    //       user.step = 3;
    //     } else if (msg.includes('saldo') || msg.includes('3')) {
    //       await client.sendText(userId, '🌐 Veja seu saldo aqui no seu Conecta Recife!\n👉 https://conecta.recife.pe.gov.br');
    //       await new Promise(resolve => setTimeout(resolve, 2500));
    //       await this.voltarAoMenuPrincipal(client, userId, user);
    //     } else if (msg.includes('moeda capiba') || msg.includes('4')) {
    //       await client.sendText(userId, 'A moeda *Capiba* é um incentivo digital oferecido pelo Conecta Recife. Você pode acumular Capibas ao participar de desafios e trocá-los por benefícios!\n🌐 Saiba mais: https://conecta.recife.pe.gov.br/servico/949');
    //       await new Promise(resolve => setTimeout(resolve, 2500));
    //       await this.voltarAoMenuPrincipal(client, userId, user);
    //     } else {
    //       await client.sendText(userId, 'Não entendi! Escolha uma das opções:\n\n1️⃣ *Desafios Mensais*\n2️⃣ *Validar meu desafio*\n3️⃣ *Saldo de Capibas*\n4️⃣ *O que é a moeda Capiba?*');
    //     }
    //     return;
    //   }

    //   if (user.step === 3) {
    //     await client.sendText(userId, '✅ Para validarmos sua atividade, envie o Documento de Validação em formato de foto 📸 ou PDF 📄.');
    //     user.step = 4;
    //     return;
    //   }

    //   if (user.step === 4) {
    //     await client.sendText(userId, 'Estamos validando essa informação... 👨‍💻');
    //     await new Promise(resolve => setTimeout(resolve, 6000));

    //     if (message.mimetype && message.mimetype.startsWith('image')) {
    //       await client.sendText(userId, '✅ Parabéns! Sua informação foi validada!\n\nVocê ganhou mais *10 moedas capibas* 🪙!');
    //       await new Promise(resolve => setTimeout(resolve, 2500));
    //       await client.sendText(userId, '🌐 Veja aqui o seu Conecta Recife!\n👉 https://conecta.recife.pe.gov.br');
    //     } else {
    //       await client.sendText(userId, 'Você não mandou um Documento válido! ⛔, tente novamente!');
    //       user.step = 3;
    //     }
    //     await new Promise(resolve => setTimeout(resolve, 2500));
    //     await this.voltarAoMenuPrincipal(client, userId, user);
    //   }
    });
  }

  private async voltarAoMenuPrincipal(client: any, userId: string, user: UserState) {
    await client.sendText(userId, `Bem-vindo(a)! Esse é o nosso sistema de atendimento do ReColhe.
    Confira as opções abaixo e escolha a que melhor atende à sua necessidade:
    1️⃣ Denunciar descarte irregular de resíduos
    2️⃣ Encontrar pontos de descarte reciclável próximo
    3️⃣ Verificar saldo
    4️⃣ Dúvidas`);
    user.step = 2;
  }

  private async verificarCadastro(userId: string): Promise<boolean> {
    // Aqui você vai futuramente consultar banco de dados ou API
    // Por enquanto, vamos simular:
    return userId.endsWith('@c.us'); // Apenas para simular verdadeiro
  }
}
