export const CONTACT_INFO = {
  whatsapp: {
    display: "+91 70019 19941",
    number: "917001919941",
    message: "Hi, I want a website",
  },
  email: "axenovadigital@gmail.com",
};

export const getWhatsAppLink = (message?: string) => {
  const msg = message || CONTACT_INFO.whatsapp.message;
  return `https://wa.me/${CONTACT_INFO.whatsapp.number}?text=${encodeURIComponent(msg)}`;
};
