module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'Method not allowed' });
    return;
  }

  const { name, contact, task } = req.body || {};

  if (!contact || !task) {
    res.status(400).json({ ok: false, error: 'Missing fields' });
    return;
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    res.status(500).json({ ok: false, error: 'Server not configured' });
    return;
  }

  const text = [
    '📩 Нова заявка з сайту',
    name ? `Ім'я: ${name}` : null,
    `Контакт: ${contact}`,
    `Задача: ${task}`,
  ].filter(Boolean).join('\n');

  try {
    const tgRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text }),
    });

    if (!tgRes.ok) throw new Error('Telegram API error');

    res.status(200).json({ ok: true });
  } catch (err) {
    res.status(502).json({ ok: false, error: 'Failed to deliver' });
  }
};
