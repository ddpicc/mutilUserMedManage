const order = {
	state: {
			post_order: []
	},

	mutations: {
		// mutations的第一个参数即为 state对象，并且可以向mutation传入额外的参数
		setOrder: (state, _order) => {
				state.post_order = _order;
		},
	},

	// 借助actions的手去 执行 mutations ， 通过  this.$store.dispatch 的方式调用
    // 可以用来执行异步操作，可以跟踪异步数据状态变化
	actions: {
		setOrderToVuex({commit, state}, _order){
				commit("setOrder", _order);
		}	
	}
};

export default order;