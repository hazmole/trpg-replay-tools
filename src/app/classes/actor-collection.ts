import { BaseCollection } from "./base-collection";


export class ActorCollection extends BaseCollection<Actor> {
  constructor() { super() }

  public Inherit(oldColle: ActorCollection): void {
    Object.values(oldColle.data).forEach(oldActor => {
      const actor = this.GetByName(oldActor.name);
      if (actor !== undefined) {
        actor.color = oldActor.color;
        actor.imgUrl = oldActor.imgUrl;
      }
    });
  }
}

export interface Actor {
  id: string;
  name: string;
  color: string;
  imgUrl: string;
};