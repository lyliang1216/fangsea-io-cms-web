import Cookie from 'js-cookie'

const app = {
    state: {
        sidebar: {
            opened: !+Cookie.get('sidebarStatus'),
            withoutAnimation: false
        },
        device: 'desktop',
        loading: false
    },
    mutations: {
        TOGGLE_SIDEBAR: state => {
            if (state.sidebar.opened) {
                Cookie.set('sidebarStatus', 1)
            } else {
                Cookie.set('sidebarStatus', 0)
            }
            state.sidebar.opened = !state.sidebar.opened
            state.sidebar.withoutAnimation = false
        },
        CLOSE_SIDEBAR: (state, withoutAnimation) => {
            Cookie.set('sidebarStatus', 1)
            state.sidebar.opened = false
            state.sidebar.withoutAnimation = withoutAnimation
        },
        TOGGLE_DEVICE: (state, device) => {
            state.device = device
        },
        UPDATE_LOADING: (state, bool) => {
            state.loading = bool
        }
    },
    actions: {
        ToggleSideBar: ({ commit }) => {
            commit('TOGGLE_SIDEBAR')
        },
        CloseSideBar ({ commit }, { withoutAnimation }) {
            commit('CLOSE_SIDEBAR', withoutAnimation)
        },
        ToggleDevice ({ commit }, device) {
            commit('TOGGLE_DEVICE', device)
        },
        UpdateLoading ({ commit }, bool) {
            commit('UPDATE_LOADING', bool)
        }
    }
}

export default app
