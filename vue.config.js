module.exports = {
	// 配置路径别名
	publicPath:"./",
	configureWebpack: {
		devServer: {
			// 调试时允许内网穿透，让外网的人访问到本地调试的H5页面
			disableHostCheck: true,
			proxy: {
			'/api': {
				target: 'https://api.dictionaryapi.dev',
				ws: true,
				changeOrigin: true,
				pathRewrite: {
					'^/api': ''
				}
			}
		}
	}
	//productionSourceMap: false,
},
}
