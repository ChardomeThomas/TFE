export interface Photo{
    photoId: number;
    dayId:number;
    url: string;
    description: string;
    visiblity: 'private' | 'public';
}