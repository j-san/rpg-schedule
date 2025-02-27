export default {
  title: "RPG Schedule",
  urls: {
    base: { path: "/", session: true },
    redirects: {
      game: { path: "/game", redirect: "/games/edit" },
      upcoming: { path: "/games", redirect: "/games/upcoming" },
      mygames: { path: "/my-games", redirect: "/games/my-games" }
    },
    game: {
      games: { path: "/games/upcoming", session: true, guildPermission: true },
      dashboard: { path: "/games/my-games", session: true, guildPermission: true },
      server: { path: "/games/server", session: true, guildPermission: true },
      create: { path: "/games/edit", session: true },
      delete: { path: "/games/delete", session: true },
      password: { path: "/games/password", session: true },
      auth: { path: "/games/authenticate", session: true },
      rsvp: { path: "/games/rsvp", session: true }
    },
    changeLang: { path: "/lang/:newLang" },
    invite: { path: "/invite" },
    login: { path: "/login" },
    logout: { path: "/logout" },
    rss: { path: "/rss/:uid" },
    timezone: {
      convert: { path: "/tz/:time/:tz" },
      countdown: { path: "/cd/:time/:tz" }
    }
  },
  formats: {
    dateLong: "llll"
  },
  author: "Sillvva#2532",
  defaults: {
    sessionStatus: {
      access: {},
      loggedInTo: []
    }
  }
};
