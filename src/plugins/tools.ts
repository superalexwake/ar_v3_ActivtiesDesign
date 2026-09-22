import type { App } from 'vue'
import 'vant/lib/index.css'
// import './index.css'
import '@/assets/styles/reset.scss' // 样式初始化
import '@/assets/styles/common.scss'
import '@/assets/styles/arupi.scss' // 通用样式文件
import "vite:style";
// import '../../pwa/firebaseAnalytics.js' // 变量文件
import {
	setToastDefaultOptions,
	Space,
	ActionSheet,
	Radio,
	RadioGroup,
	Sidebar,
	SidebarItem,
	Grid,
	GridItem,
	Checkbox,
	Button,
	Sticky,
	Icon,
	Tab,
	Tabs,
	Progress,
	Dialog,
	Divider,
	Collapse,
	CollapseItem,
	Switch,
	Loading,
	Circle,
	DatePicker,
	Col,
	Row,
	Field,
	Popup,
	Picker,
	CountDown,
	Slider,
	List,
	Toast,
	Skeleton,
	Uploader,
	Calendar,
	PullRefresh,
	Badge,
	Popover,
	Image,
	FloatingBubble
} from 'vant'
import I18n from '@/languages/index'
import directives from '@/directives/index'
import { filter } from '@/utils'
import { greatPwa } from '@/hooks/usePwa'
import NavBar from '@/components/common/NavBar.vue'
import LoadingView from '@/components/common/LoadingView.vue'
import svgIcon from '@/components/common/svgIcons.vue'
import ArSelect from '@/components/common/ArSelect.vue'
import Maintain from '@/components/common/Maintain.vue'
setToastDefaultOptions({ duration: 3500,zIndex:4000 });
greatPwa()
export default (app: App<Element>) => {
	app.component('NavBar', NavBar)
	app.component('LoadingView', LoadingView)
	app.component('ArSelect', ArSelect)
	app.component('svg-icon', svgIcon)
	app.component('Maintain',Maintain)
	app.use(ActionSheet)
		.use(Radio)
		.use(RadioGroup)
		.use(Sidebar)
		.use(SidebarItem)
		.use(Grid)
		.use(GridItem)
		.use(Checkbox)
		.use(Button)
		.use(Sticky)
		.use(Icon)
		.use(Tab)
		.use(Tabs)
		.use(Progress)
		.use(Dialog)
		.use(Divider)
		.use(Collapse)
		.use(CollapseItem)
		.use(Switch)
		.use(Loading)
		.use(Circle)
		.use(DatePicker)
		.use(Col)
		.use(Row)
		.use(Slider)
		.use(List)
		.use(Field)
		.use(Toast)
		.use(Popup)
		.use(Picker)
		.use(CountDown)
		.use(Skeleton)
		.use(Uploader)
		.use(Calendar)
		.use(PullRefresh)
		.use(Badge)
		.use(Popover)
		.use(I18n)
		.use(directives)
		.use(Image)
		.use(Space)
		.use(FloatingBubble)
	let GLOBAL_ATTR = app.config.globalProperties
	let $u = {}
	$u['TopHeight'] = 38
	//全局注册过滤器
	Object.keys(filter.refiter).forEach((filterName) => {
		$u[filterName] = filter.refiter[filterName]
	})
	GLOBAL_ATTR.$u = $u
}
