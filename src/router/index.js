import Vue from 'vue';
import Router from 'vue-router';
const _import = require('./_import_' + process.env.NODE_ENV);
import Full from '@/containers/Full'


// Views - Pages
import Page404 from '@/views/errorPages/Page404'
import Page500 from '@/views/errorPages/Page500'


/* login */
const Login = _import('login/index');
Vue.use(Router);

export const constantRouterMap = [
    { path: '/login', component: Login, hidden: true },
    {path: '/pages',redirect: '/pages/p404', name: 'Pages',
          component: {
            render (c) { return c('router-view') }
              // Full,
          },
          children: [{path: '404',  name: 'Page404', component: _import('errorPages/Page404') },
                     {path: '500',name: 'Page500',component: _import('errorPages/Page404')},
                    ]
    }


]

export default new Router({
  mode: 'hash', 
  linkActiveClass: 'open active',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
});

export const asyncRouterMap = [
  {
    path: '/',
    redirect: '/orderCreate',
    name: '首页',
    component: Full,
    hidden:false,
    children: [
      {path: '/dashboard',name: '总览',icon:'speedometer',component: _import('Dashboard'),icon:'md-book',meta: { role: ['admin'] }},
      {path: '/orderCreate',name: '生成处方',component: _import('components/OrderCreate'),icon:'md-create'},
      {path: '/otherEntry',name: '其它录入',component: _import('components/OtherEntry'),icon:'md-add'},
      {path: '/orderlist',name: '订单管理',component: _import('components/OrderList'),icon:'md-list-box'},
      {path: '/detailInvoice',name: '详细账单',component: _import('components/DetailInvoice'),icon:'md-document',meta: { role: ['admin'] }},
      //{path: '/introduction',name: '介绍',icon:'thumbsup',component: _import('Introduction'),meta: { role: ['admin'] }},
      {path: '/medlist',name: '药品管理',component: _import('components/MedList'),icon:'md-medkit',meta: { role: ['admin'] }},
      {path: '/inventoryManage',name: '库存管理',component: _import('components/InventoryManage'),icon:'md-archive',meta: { role: ['admin'] }},
      /* {path: '/charts',name: 'echart',redirect: '/charts/shopchart',icon:'pie-graph',
        component: {render (c) { return c('router-view') }},
        children: [ {path: 'shopchart',name: '商场统计图表',icon:'stats-bars',component: _import('charts/ShopChart'), hidden:false, },
                    {path: 'radarchart',name: '雷达图',icon:'arrow-graph-up-right',component: _import('charts/RadarChart')},
                    {path: 'cakechart',name: '蛋糕销量图表',icon:'ios-analytics',component: _import('charts/CakeChart')}
                  ]
      },
      {path: '/markdown',name: 'Markdown',icon:"android-list",component: _import('Markdown')}, */
      
    ]
  },

  { path: '*', redirect: '/pages/404', hidden: true }
  
];
