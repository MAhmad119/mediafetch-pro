export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ success: false, message: 'URL is required' });
  }

  try {
    const apiRes = await fetch('https://api.cobalt.tools/api/json', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ url, vQuality: '1080' })
    });

    const data = await apiRes.json();

    if (data && (data.url || (data.picker && data.picker.length > 0))) {
      const downloadUrl = data.url || data.picker[0].url;
      return res.status(200).json({
        success: true,
        downloadUrl: downloadUrl,
        audioUrl: data.audio || downloadUrl,
        filename: "MediaFetch_" + Date.now() + ".mp4"
      });
    } else {
      return res.status(400).json({ success: false, message: 'Invalid media link or private post.' });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
}
