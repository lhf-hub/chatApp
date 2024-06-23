import { ITheme } from "./ITheme";

export const DarkTheme: ITheme = {
    primary: {
        Normal: "#BB86FC", // 主色调
        LightVariant: "#EEB2FF", // 主色调 - 浅色变体
        DarkVariant: "#6200EE", // 主色调 - 深色变体
        On: "#000000" // 主色调上的文字/图标颜色
    },
    secondary: {
        Normal: "#03DAC6", // 辅助色调
        LightVariant: "#67E8F9", // 辅助色调 - 浅色变体
        DarkVariant: "#03DAC6", // 辅助色调 - 深色变体
        On: "#5F5F5F" // 辅助色调上的文字/图标颜色
    },
    info: {
        Normal: "#90CAF9", // 信息提示色
        LightVariant: "#C3FDFF", // 信息提示色 - 浅色变体
        DarkVariant: "#5D99C6", // 信息提示色 - 深色变体
        On: "#000000", // 信息提示色上的文字/图标颜色
    },
    success: {
        Normal: "#66BB6A", // 成功提示色
        LightVariant: "#98EE99", // 成功提示色 - 浅色变体
        DarkVariant: "#338A3E", // 成功提示色 - 深色变体
        On: "#000000" // 成功提示色上的文字/图标颜色
    },
    warning: {
        Normal: "#FFD54F", // 警告提示色
        LightVariant: "#FFFF81", // 警告提示色 - 浅色变体
        DarkVariant: "#C8A415", // 警告提示色 - 深色变体
        On: "#000000" // 警告提示色上的文字/图标颜色
    },
    error: {
        Normal: "#CF6679", // 错误色
        LightVariant: "#FF8A8A", // 错误色 - 浅色变体
        DarkVariant: "#B00020", // 错误色 - 深色变体
        On: "#000000" // 错误色上的文字/图标颜色
    },
    background: {
        Normal: "#1A1A1A", // 背景色
        On: "#BCBCBC" // 背景色上的文字/图标颜色
    },
    surface: {
        Normal: "#070707", // 表面色
        On: "#FFFFFF" // 表面色上的文字/图标颜色
    },
    divider: {
        Normal: "#2D2D2D", // 分割线
        Highlight: "#BDBDBD" // 高亮分割线
    }
}