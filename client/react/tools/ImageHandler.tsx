export class ImageHandler {
    public static toBase64 = (source: string) => {
        return 'data:image/png;base64,' + source;
    }
}