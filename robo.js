(() => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const assistant = document.createElement('div');
  assistant.className = 'voice-assistant';
  assistant.innerHTML = `
    <div class="voice-panel">
      <div class="voice-status" role="status" aria-live="polite">
        Toque em “Chamar robô” e diga um comando.
      </div>
      <form class="voice-fallback" hidden>
        <input class="voice-input" type="text" aria-label="Digite um comando para o robô" placeholder="Digite um comando">
        <button class="voice-send" type="submit">Enviar</button>
      </form>
    </div>
    <button class="voice-button" type="button" aria-label="Chamar robô" title="Chamar robô">
      <span aria-hidden="true">🎙️</span>
      <span>Chamar robô</span>
    </button>
  `;
  document.body.appendChild(assistant);

  const button = assistant.querySelector('.voice-button');
  const status = assistant.querySelector('.voice-status');
  const form = assistant.querySelector('.voice-fallback');
  const input = assistant.querySelector('.voice-input');
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;
  let listening = false;

  function normalize(text) {
    return text.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[.,!?]/g, '')
      .trim();
  }

  function reply(message) {
    status.textContent = message;
    if (!('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    const speech = new SpeechSynthesisUtterance(message);
    speech.lang = 'pt-BR';
    window.speechSynthesis.speak(speech);
  }

  function showProducts() {
    document.querySelector('.wrap').scrollIntoView({ behavior: 'smooth' });
  }

  function findProducts(words) {
    const terms = normalize(words)
      .replace(/\b(adicionar|adiciona|colocar|coloca|comprar|compra|produto|produtos|carrinho|sacola|um|uma|o|a|ao|no|na|do|da|para|pro|por favor|busque|buscar|pesquisar|procurar|mostre|mostrar|quero|todos|todas|os|as)\b/g, ' ')
      .split(/\s+/)
      .filter(Boolean);

    return window.GeekZone.products.filter(product => {
      const name = normalize(product.name);
      return terms.length && terms.every(term => name.includes(term));
    });
  }

  function runCommand(text) {
    const command = normalize(text);
    const shop = window.GeekZone;

    if (!shop) {
      reply('A loja ainda não terminou de carregar.');
      return;
    }

    if (/\b(claro|luminoso)\b/.test(command)) {
      shop.setTheme('light');
      reply('Modo claro ativado.');
      return;
    }

    if (/\b(escuro|noturno)\b/.test(command)) {
      shop.setTheme('dark');
      reply('Modo escuro ativado.');
      return;
    }

    if (/\b(fechar|feche)\b/.test(command) && /\b(carrinho|sacola)\b/.test(command)) {
      shop.openCart(false);
      reply('Carrinho fechado.');
      return;
    }

    if (/\b(carrinho|sacola)\b/.test(command) && !/\b(adicionar|colocar|comprar)\b/.test(command)) {
      shop.openCart(true);
      reply('Abrindo seu carrinho.');
      return;
    }

    if (/\b(ajuda|comandos)\b/.test(command)) {
      reply('Você pode pedir modo claro, modo escuro, abrir o carrinho, buscar produtos ou mostrar uma categoria.');
      return;
    }

    const categories = ['Periféricos', 'Monitores', 'Hardware', 'Colecionáveis'];
    const category = categories.find(name => command.includes(normalize(name)));

    if (category) {
      shop.search('');
      shop.filterCategory(category);
      showProducts();
      reply(`Mostrando produtos de ${category}.`);
      return;
    }

    if (/\b(todos os produtos|ver produtos|mostrar produtos|mostrar tudo)\b/.test(command)) {
      shop.filterCategory('Todos');
      shop.search('');
      showProducts();
      reply('Mostrando todos os produtos.');
      return;
    }

    const wantsToAdd = /\b(adicionar|adiciona|colocar|coloca|comprar|compra)\b/.test(command);
    const matches = findProducts(command);

    if (wantsToAdd) {
      if (matches.length === 1) {
        shop.addToCart(matches[0].id);
        reply(`${matches[0].name} adicionado ao carrinho.`);
      } else if (matches.length > 1) {
        shop.filterCategory('Todos');
        shop.search(matches[0].name.split(' ')[0]);
        showProducts();
        reply(`Encontrei ${matches.length} produtos. Escolha um deles na tela.`);
      } else {
        reply('Não encontrei esse produto.');
      }
      return;
    }

    if (/^(buscar|busque|pesquisar|procurar|mostre|mostrar|quero)\b/.test(command)) {
      shop.filterCategory('Todos');
      shop.search(matches.length === 1 ? matches[0].name : command.replace(/^(buscar|busque|pesquisar|procurar|mostre|mostrar|quero)\s+/, ''));
      showProducts();
      reply(matches.length ? 'Aqui estão os produtos encontrados.' : 'Não encontrei produtos com esse nome.');
      return;
    }

    reply('Não entendi. Diga “ajuda” para ver alguns comandos.');
  }

  if (recognition) {
    recognition.lang = 'pt-BR';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      listening = true;
      button.classList.add('listening');
      button.setAttribute('aria-label', 'Parar de ouvir');
      button.lastElementChild.textContent = 'Ouvindo...';
      status.textContent = 'Estou ouvindo...';
    };

    recognition.onend = () => {
      listening = false;
      button.classList.remove('listening');
      button.setAttribute('aria-label', 'Chamar robô');
      button.lastElementChild.textContent = 'Chamar robô';
    };

    recognition.onresult = event => runCommand(event.results[0][0].transcript);
    recognition.onerror = event => {
      const errors = {
        'not-allowed': 'Permita o acesso ao microfone.',
        'no-speech': 'Não ouvi nada. Tente novamente.',
        'audio-capture': 'Não encontrei um microfone.',
        'service-not-allowed': 'O microfone precisa de HTTPS ou localhost.'
      };

      status.textContent = errors[event.error] || 'A voz não funcionou. Digite seu comando abaixo.';
      form.hidden = false;
    };

    button.addEventListener('click', () => {
      if (listening) {
        recognition.stop();
        return;
      }

      window.speechSynthesis?.cancel();
      try {
        recognition.start();
      } catch (error) {
        status.textContent = window.isSecureContext
          ? 'Verifique a permissão do microfone e tente novamente.'
          : 'Para usar o microfone, abra o site em HTTPS ou localhost.';
        form.hidden = false;
      }
    });
  } else {
    status.textContent = 'A voz não está disponível. Digite seu comando.';
    form.hidden = false;
    button.addEventListener('click', () => input.focus());
  }

  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!input.value.trim()) {
      status.textContent = 'Digite um comando primeiro.';
      input.focus();
      return;
    }

    runCommand(input.value);
    input.value = '';
  });
})();
