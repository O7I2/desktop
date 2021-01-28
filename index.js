const electron = require("electron");
const {
	app,
	BrowserWindow,
	ipcMain
} = electron;
const path = require("path");


let mainWindow;
let heyplay = {
	log (){
		console.log("[HeyPlay] ", ...arguments);
	},
	file: {
		icon: path.join(
			__dirname,
			"assets/icon.png"
		),
		main: path.join(
			__dirname,
			"app/index.html"
		)
	}
};
function afterReady() {
	heyplay.log("app 已经 ready");
	mainWindow = new BrowserWindow(
		{
			minWidth: 850,
			minHeight: 600,
			width: 1000,
			height: 600,
			useContentSize: true,

			frame: false,
			//transparent: true,
			show: false,
			icon: heyplay.file.icon,

			webPreferences: {
				nodeIntegration: true
			}
		}
	);
	heyplay.log("mainWindow 已创建 BrowserWindow 对象")
	mainWindow.loadFile(heyplay.file.main);
	//mainWindow.webContents.openDevTools();
	
	ipcMain.on("windowOpeation", function (event, arg){
		heyplay.log("收到 mainWindow 的窗口调整 ipc");
		switch (arg) {
			case "minimize":
				mainWindow.minimize();
				break;
			case "windowize":
				mainWindow.unmaximize();
				break;
			case "maximize":
				mainWindow.maximize();
				break;
			case "close":
				mainWindow.close();
				break;
			default:
				break;
		}
	});

	mainWindow.on("maximize", function (){
		heyplay.log("mainWindow 最大化了");
		mainWindow.webContents.send("windowState", "maximized");
	});

	mainWindow.on("unmaximize", function (){
		heyplay.log("mainWindow 窗口化了");
		mainWindow.webContents.send("windowState", "windowized");
	});


	mainWindow.on("ready-to-show", function (){
		heyplay.log("mainWindow 已经 ready-to-show");
		mainWindow.show();
		mainWindow.webContents.send("windowState", mainWindow.isMaximized() ? "maximized" : "windowized")
	});

	mainWindow.on("closed", function () {
		heyplay.log("mainWindow 已经 closed");
		mainWindow = null;
	});
}


app.whenReady().then(afterReady);

app.on("window-all-closed", () => {
	heyplay.log("所有窗口全部关闭了");
	if (process.platform !== "darwin") {
		heyplay.log("退出应用程序");
		app.quit();
	};
});

app.on("activate", () => {
	heyplay.log("app 已激活")
	if (BrowserWindow.getAllWindows().length === 0) {
		heyplay.log("没有窗口，创建一个");
		createWindow();
	};
});