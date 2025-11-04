export default {
  title: "Documentation de Mon Projet",
  lang: 'en-US',
  base: process.env.NODE_ENV === 'production' ? '/Whanos_Documentantion/' : '/',
  link: '/',
  description: "Une documentation générée avec VitePress",
  
  themeConfig: {
    nav: [
      { text: "Accueil", link: "/" },
      { text: "Guide", link: "/Users/QUICK_START_K8S.md"}
    ],
    sidebar: {
      "/guide/": [
        {
          text: "Guide",
          items: [
            { text: "Introduction", link: "/Devs/QUICK_START_K8S.md" }
          ]
        }
      ]
    },
    socialLinks: [
      { icon: "github", link: "https://github.com/ton-projet" }
    ]
  }
};
