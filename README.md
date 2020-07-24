# point-and-click-test
 First point and click game

 Play at https://gaffasaurus.github.io/point-and-click-test/

## JSON format

The JSON is an object mapping room IDs to rooms:

```json
{
  "Room ID": {
    "bg": "images/bgimages/room3 bg.png",
    "clickables": [...]
  }
}
```

The game starts in the room with ID `main room`.

### Clickables

Clickables have a `type`, a position (`x` and `y`) and an `action`. If any of your actions introduce new images, be sure to include a `preload` property with an array of image URLs to load beforehand.

#### Images

Image clickables can also have an optional `idealHeight` property to resize the image.

```json
{
  "type": "image",
  "image": "images/cello.png",
  "x": 150,
  "y": 300,
  "action": { ... }
}
```

#### Arrows

The arrow direction can be either `up`, `right`, `left`, or `down`.

```json
{
  "type": "arrow",
  "direction": "down",
  "x": 640,
  "y": 562,
  "action": { ... }
}
```

### Actions

All actions have a `type`. Actions specify the behaviour of an object when it's clicked by the user.

#### Show text

You can give an array of strings to display in a text box. It'll show each string one by one, and the user clicks to see the next string.

```json
{
  "type": "text",
  "text": ["Text to display on click"]
}
```

#### Switch rooms

```json
{
  "type": "room",
  "dest": "Room ID"
}
```

#### Give an item

`image` is the item's icon image, `name` is its name, and `id` is an ID used for combinations and unlocking objects. Set `reusable` to `true` if you want the user to keep the item after unlocking an object.

When you take the item, the clickable gets deleted. There's an optional `replace` property that takes a clickable to be added in its place. Remember to preload new images in the parent clickable's `clickable`!

```json
{
  "type": "item",
  "text": ["Text to show when the user gets the item."],
  "image": "images/paper.png",
  "name": "Item name",
  "id": "Item ID",
  "reusable": false
}
```

There's also an optional `combinations` property, which takes an array of possible combinations:

```json
"combinations": [
  {
    "partner": "Other item ID",
    "image": "images/juice.png",
    "name": "Product name",
    "id": "Product ID"
  }
]
```

This isn't automatically commutative, so you also need to specify the corresponding combination in the partner item. `image`, `name`, and `id` are for the item that is produced from combining the two items.

#### Require a certain item to unlock

`key` is an array of item IDs that can be used to unlock the object. `unlocked` is a clickable to replace the locked clickable. Remember to preload new images in the parent clickable's `clickable`!

```json
{
  "type": "locked",
  "key": ["Key ID"],
  "text": ["Text to show while locked"],
  "unlockText": ["Text to show when you unlock"],
  "unlocked": { ... }
}
```

#### Play audio

Note that the audio won't stop if you click on the object repeatedly.

```json
{
  "type": "audio",
  "file": "audio/prokofiev cello.mp3"
}
```
