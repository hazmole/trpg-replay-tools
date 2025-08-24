

export class BaseCollection<T extends BaseItem> {
  
  protected data: Record<string, T>;
  
  constructor() {
    this.data = {};
  }

  // Setter
  public Add(ID: string, item: T, isForceAdded?: boolean): T {
    if (!isForceAdded && this.checkIsItemExisted(item)) {
      return this.findSameItem(item);
    } else {
      if (ID === "") {
        item.id = this.genUID();
      }
      this.data[item.id] = item;
      return item;
    }
  }
  public Remove(ID: string): void {
    delete this.data[ID];
  }
  public Update(ID: string, newValues: Partial<T>) {
    const item = this.data[ID];
    Object.assign(item, newValues);
  }

  // Getter
  public GetList(): Array<T> {
    return Object.values(this.data);
  }
  public GetByID(ID: string): T {
    return this.data[ID];
  }
  public GetByName(name: string): (T | undefined) {
    return Object.values(this.data).find((actor => {
      return name === actor.name;
    }))
  }

  // Load/Export
  public Clear(): void {
    this.data = {};
  }
  public FromJson(data: { [key:string]: T }): void {
    this.data = data;
  }
  public ToJson(): { [key:string]: T } {
    return this.data;
  }

  protected checkIsItemExisted(newItem: T): boolean {
    // find by ID
    if (newItem.id !== "") {
      return (this.data[newItem.id] != null);
    }
    // find by Name
    return (null != Object.values(this.data).find((actor => {
      return newItem.name === actor.name;
    })));
  }

  protected findSameItem(targetItem: T): T {
    if (targetItem.id === "") {
      return Object.values(this.data).find(item => item.name === targetItem.name) || targetItem;
    }
    return this.data[targetItem.id];
  }

  // UID supported
  private genUID(): string {
    let UID = "";
    do {
      UID = this.genRandomID();
    } while (!!this.data[UID])
    return UID;
  }
  private genRandomID(): string {
    var S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+S4());
  }

}

interface BaseItem {
  id: string;
  name: string;
}