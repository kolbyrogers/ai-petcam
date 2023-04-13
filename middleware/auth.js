export default function ({ app, route, redirect }) {
  if (!app.$fire.auth.currentUser && route.path !== '/login') {
    return redirect('/login')
  }
  if (route.path === '/login') {
    if (app.$fire.auth.currentUser) {
      return redirect('/')
    }
  }
}
