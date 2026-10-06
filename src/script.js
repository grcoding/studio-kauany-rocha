document.addEventListener('DOMContentLoaded', () => {
  // Constante Universal para Configuração do WhatsApp
  const WHATSAPP_PHONE_NUMBER = '556291686474';

  // 1. Atualizar Ano no Copyright
  const currentYearSpan = document.getElementById('currentYear');
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  // 2. Menu Mobile Drawer
  const menuToggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const closeMobileMenu = document.getElementById('closeMobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => mobileMenu.classList.add('active'));
    if (closeMobileMenu) {
      closeMobileMenu.addEventListener('click', () => mobileMenu.classList.remove('active'));
    }
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => mobileMenu.classList.remove('active'));
    });
  }

  // 3. FAQ Accordion (Estilo Ajustes do iOS)
  const faqTriggers = document.querySelectorAll('.faq-trigger');
  faqTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const item = trigger.parentElement;
      const answer = item.querySelector('.faq-answer');
      const isExpanded = trigger.getAttribute('aria-expanded') === 'true';

      // Fecha outros itens para comportamento de acordeão limpo
      document.querySelectorAll('.faq-item').forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const otherTrigger = otherItem.querySelector('.faq-trigger');
          const otherAnswer = otherItem.querySelector('.faq-answer');
          if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
          if (otherAnswer) otherAnswer.style.maxHeight = null;
        }
      });

      if (!isExpanded) {
        item.classList.add('active');
        trigger.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      } else {
        item.classList.remove('active');
        trigger.setAttribute('aria-expanded', 'false');
        answer.style.maxHeight = null;
      }
    });
  });

  // 4. Modal Sheet de Catálogo no bio.html
  const openCatalogModalBtn = document.getElementById('openCatalogModal');
  const catalogModal = document.getElementById('catalogModal');
  const closeCatalogModalBtn = document.getElementById('closeCatalogModal');

  if (openCatalogModalBtn && catalogModal) {
    const openModal = () => {
      catalogModal.classList.add('active');
      catalogModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden'; // Evita scroll do fundo
    };

    const closeModal = () => {
      catalogModal.classList.remove('active');
      catalogModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    };

    openCatalogModalBtn.addEventListener('click', openModal);

    if (closeCatalogModalBtn) {
      closeCatalogModalBtn.addEventListener('click', closeModal);
    }

    // Fechar ao clicar no backdrop escuro
    catalogModal.addEventListener('click', (e) => {
      if (e.target === catalogModal) closeModal();
    });

    // Fechar ao pressionar a tecla ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && catalogModal.classList.contains('active')) {
        closeModal();
      }
    });
  }

  // 5. Calendário Interativo Estilizado (Bloqueio de datas passadas)
  const monthYearLabel = document.getElementById('monthYearLabel');
  const calendarDays = document.getElementById('calendarDays');
  const prevMonthBtn = document.getElementById('prevMonthBtn');
  const nextMonthBtn = document.getElementById('nextMonthBtn');
  const selectedDateInput = document.getElementById('selectedDate');
  const dateStatus = document.getElementById('dateStatus');

  if (calendarDays && monthYearLabel) {
    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const monthNames = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];

    function renderCalendar(month, year) {
      calendarDays.innerHTML = '';
      monthYearLabel.textContent = `${monthNames[month]} ${year}`;

      const firstDayIndex = new Date(year, month, 1).getDay();
      const totalDays = new Date(year, month + 1, 0).getDate();

      // Espaçadores para os dias da semana anteriores
      for (let i = 0; i < firstDayIndex; i++) {
        const emptySpan = document.createElement('span');
        calendarDays.appendChild(emptySpan);
      }

      // Renderizar os dias do mês
      for (let day = 1; day <= totalDays; day++) {
        const dayBtn = document.createElement('button');
        dayBtn.type = 'button';
        dayBtn.classList.add('calendar-day');
        dayBtn.textContent = day;

        const thisDate = new Date(year, month, day);
        thisDate.setHours(0, 0, 0, 0);

        // Bloqueia domingos (estúdio fechado) e datas anteriores ao dia atual
        if (thisDate < today || thisDate.getDay() === 0) {
          dayBtn.classList.add('disabled');
          dayBtn.disabled = true;
        } else {
          dayBtn.addEventListener('click', () => {
            document.querySelectorAll('.calendar-day').forEach(d => d.classList.remove('selected'));
            dayBtn.classList.add('selected');

            const formattedDate = `${String(day).padStart(2, '0')}/${String(month + 1).padStart(2, '0')}/${year}`;
            selectedDateInput.value = formattedDate;
            if (dateStatus) {
              dateStatus.textContent = `Data selecionada: ${formattedDate}`;
              dateStatus.style.color = 'var(--color-accent-emerald)';
            }
          });
        }

        calendarDays.appendChild(dayBtn);
      }
    }

    if (prevMonthBtn && nextMonthBtn) {
      prevMonthBtn.addEventListener('click', () => {
        currentMonth--;
        if (currentMonth < 0) {
          currentMonth = 11;
          currentYear--;
        }
        renderCalendar(currentMonth, currentYear);
      });

      nextMonthBtn.addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 11) {
          currentMonth = 0;
          currentYear++;
        }
        renderCalendar(currentMonth, currentYear);
      });
    }

    renderCalendar(currentMonth, currentYear);
  }

  // 6. Seleção de Time Slots (Pílulas Horárias)
  const timeSlotBtns = document.querySelectorAll('.time-slot-btn');
  const selectedTimeInput = document.getElementById('selectedTime');
  const timeStatus = document.getElementById('timeStatus');

  timeSlotBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      timeSlotBtns.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      const time = btn.getAttribute('data-time');
      if (selectedTimeInput) selectedTimeInput.value = time;
      if (timeStatus) {
        timeStatus.textContent = `Horário selecionado: ${time}`;
        timeStatus.style.color = 'var(--color-accent-emerald)';
      }
    });
  });

  // 7. Validação do Formulário e Integração Dinâmica com wa.me
  const bookingForm = document.getElementById('bookingForm');
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('clientName').value.trim();
      const phone = document.getElementById('clientPhone').value.trim();
      const service = document.getElementById('serviceSelect').value;
      const date = document.getElementById('selectedDate').value;
      const time = document.getElementById('selectedTime').value;

      if (!name || !phone || !service) {
        alert('Por favor, preencha seu nome, telefone e selecione o procedimento desejado.');
        return;
      }

      if (!date) {
        alert('Por favor, selecione uma data disponível no calendário.');
        return;
      }

      if (!time) {
        alert('Por favor, selecione um horário sugerido.');
        return;
      }

      // Montagem da mensagem estruturada
      const message = `Olá! Gostaria de solicitar um agendamento no Studio:
• Nome: ${name}
• Telefone: ${phone}
• Procedimento: ${service}
• Data: ${date}
• Horário sugerido: ${time}

Ainda há disponibilidade para este horário?`;

      // Codificação para URL segura (wa.me)
      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${WHATSAPP_PHONE_NUMBER}?text=${encodedMessage}`;

      // Redireciona em nova aba
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    });
  }
});