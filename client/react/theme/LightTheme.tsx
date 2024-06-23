import { ITheme } from "./ITheme";

export const LightTheme: ITheme = {
    primary: {
        Normal: "#1565C0", // 主色调
        LightVariant: "#5E92F3", // 主色调 - 浅色变体
        DarkVariant: "#003C8F", // 主色调 - 深色变体
        On: "#FFFFFF" // 主色调上的文字/图标颜色
    },
    secondary: {
        Normal: "#03DAC6", // 辅助色调
        LightVariant: "#67E8F9", // 辅助色调 - 浅色变体
        DarkVariant: "#018786", // 辅助色调 - 深色变体
        On: "#A0A0A0" // 辅助色调上的文字/图标颜色
    },
    info: {
        Normal: "#2196F3", // 信息提示色
        LightVariant: "#6EC6FF", // 信息提示色 - 浅色变体
        DarkVariant: "#0069C0", // 信息提示色 - 深色变体
        On: "#FFFFFF" // 信息提示色上的文字/图标颜色
    },
    success: {
        Normal: "#4CAF50", // 成功提示色
        LightVariant: "#80E27E", // 成功提示色 - 浅色变体
        DarkVariant: "#087F23", // 成功提示色 - 深色变体
        On: "#FFFFFF" // 成功提示色上的文字/图标颜色
    },
    warning: {
        Normal: "#FFC107", // 警告提示色
        LightVariant: "#FFF350", // 警告提示色 - 浅色变体
        DarkVariant: "#C79100", // 警告提示色 - 深色变体
        On: "#FFFFFF" // 警告提示色上的文字/图标颜色

    },
    error: {
        Normal: "#B00020", // 错误色
        LightVariant: "#FF6D6D", // 错误色 - 浅色变体
        DarkVariant: "#790000", // 错误色 - 深色变体
        On: "#FFFFFF" // 错误色上的文字/图标颜色
    },
    background: {
        Normal: "#EDEDED", // 背景色
        On: "#323232" // 背景色上的文字/图标颜色
    },
    surface: {
        Normal: "#FFFFFF", // 表面色
        On: "#000000" // 表面色上的文字/图标颜色
    },

    divider: {
        Normal: "#E0E0E0", // 分割线
        Highlight: "#303030" // 高亮分割线
    }
}
