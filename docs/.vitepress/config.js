export default {
  title: "Documentation of Whanos",
  lang: 'en-US',
  base: process.env.NODE_ENV === 'production' ? '/Whanos_Documentantion/' : '/',
  link: '/',
  description: "Une documentation générée avec VitePress",
  
  themeConfig: {
    nav: [
      { text: "Accueil", link: "/" },
      // { text: "Users Doc", link: "/Users/QUICK_START_K8S.md"},
      { text: "Devs Doc", link: "/Devs/index.md" }
    ],
    // sidebar: {
    //   "/guide/": [
    //     {
    //       text: "Guide",
    //       items: [
    //         { text: "Introduction", link: "/Devs/QUICK_START_K8S.md" },
    //         { text: "Installation", link: "/Devs/index.md" }
    //       ]
    //     }
    //   ]
    // },
    socialLinks: [
      { icon: "github", link: "https://github.com/ton-projet" }
    ]
  }
};
