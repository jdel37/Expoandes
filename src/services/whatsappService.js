import api from '../api/api';

export const sendWhatsAppMessage = async (number, message) => {
  try {
    const res = await api.post('/whatsapp/send', { number, message });
    return res.data;
  } catch (error) {
    console.error('Error enviando mensaje:', error);
  }
};
