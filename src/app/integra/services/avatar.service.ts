import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
// import { AvatarDTO, AvatarEnvioDTO } from '../../Models/Avatar';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AvatarService {
  isBrowser: boolean;
  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  GetUrlImagenAvatar(avatar:any):string{
    var url='https://avataaars.io/?avatarStyle=Circle&topType=';
    url +=avatar.topC+'&accessoriesType=';
    url +=avatar.accessories+'&hairColor=';
    url +=avatar.hair_Color+'&facialHairType=';
    url +=avatar.facial_Hair+'&facialHairColor=';
    url +=avatar.facial_Hair_Color+'&clotheType=';
    url +=avatar.clothes+'&clotheColor=';
    url +=avatar.clothes_Color+'&eyeType=';
    url +=avatar.eyes+'&eyebrowType=';
    url +=avatar.eyesbrow+'&mouthType=';
    url +=avatar.mouth+'&skinColor=';
    url +=avatar.skin;
    return url;
  }
}
