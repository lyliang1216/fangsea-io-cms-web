const getters = {
    loading: state => state.app.loading,
    sidebar: state => state.app.sidebar,
    device: state => state.app.device,
    token: state => state.user.token,
    roles: state => state.user.roles
}
export default getters
