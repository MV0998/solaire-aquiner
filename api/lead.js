export default async function handler(req, res) {
  // CORS — autorise votre domaine Vercel
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { prenom, nom, telephone, commune, statut, toiture } = req.body;

  if (!prenom || !nom || !telephone) {
    return res.status(400).json({ error: 'Champs manquants' });
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'Aquiner Leads <onboarding@resend.dev>',
        to: ['c.steffenwilfried@gmail.com'],
        subject: `🌞 Nouveau lead Aquiner — ${prenom} ${nom}`,
        html: `
          <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:2rem;">

            <div style="background:linear-gradient(135deg,#EF9F27,#F5B830);border-radius:14px;padding:1.2rem 1.5rem;margin-bottom:1.5rem;">
              <h1 style="color:#412402;margin:0;font-size:20px;font-weight:600;">
                🌞 Nouveau lead — Aquiner
              </h1>
              <p style="color:rgba(65,36,2,0.7);margin:4px 0 0;font-size:13px;">
                ${new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' })}
              </p>
            </div>

            <table style="width:100%;border-collapse:collapse;font-size:14px;">
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;color:#888;width:38%">Prénom</td>
                <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;font-weight:500;color:#1C1A14">${prenom}</td>
              </tr>
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;color:#888">Nom</td>
                <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;font-weight:500;color:#1C1A14">${nom}</td>
              </tr>
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;color:#888">Téléphone</td>
                <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;">
                  <a href="tel:${telephone}" style="color:#EF9F27;font-weight:600;font-size:16px;text-decoration:none;">
                    📞 ${telephone}
                  </a>
                </td>
              </tr>
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;color:#888">Secteur</td>
                <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;font-weight:500;color:#1C1A14">${commune || '—'}</td>
              </tr>
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;color:#888">Statut</td>
                <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;font-weight:500;color:#1C1A14">${statut || '—'}</td>
              </tr>
              <tr>
                <td style="padding:10px 0;color:#888">Toiture</td>
                <td style="padding:10px 0;font-weight:500;color:#1C1A14">${toiture || '—'}</td>
              </tr>
            </table>

            <div style="margin-top:1.5rem;background:#FDF3E3;border:1px solid rgba(186,117,23,0.2);border-radius:12px;padding:1rem 1.2rem;">
              <p style="margin:0;font-size:13px;color:#854F0B;font-weight:500;">
                ⏱ Rappeler dans l'heure pour maximiser la conversion !
              </p>
            </div>

            <p style="font-size:11px;color:#ccc;margin-top:1.5rem;text-align:center;">
              Aquiner · Gironde · solaire-aquiner.vercel.app
            </p>
          </div>
        `
      })
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('Resend error:', err);
      return res.status(500).json({ error: 'Resend failed', detail: err });
    }

    return res.status(200).json({ success: true });

  } catch (err) {
    console.error('Handler error:', err);
    return res.status(500).json({ error: err.message });
  }
}
