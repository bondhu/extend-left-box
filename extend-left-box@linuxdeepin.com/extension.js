const Clutter = imports.gi.Clutter;
const Main = imports.ui.main;
const Gi = imports._gi;

let panel;

function vfunc_allocate(box, flags) {
    this.set_allocation(box, flags);

    let allocWidth = box.x2 - box.x1;
    let allocHeight = box.y2 - box.y1;

    let [leftMinWidth, leftNaturalWidth] = this._leftBox.get_preferred_width(-1);
    let [centerMinWidth, centerNaturalWidth] = this._centerBox.get_preferred_width(-1);
    let [rightMinWidth, rightNaturalWidth] = this._rightBox.get_preferred_width(-1);

    let sideWidth = allocWidth - rightNaturalWidth - centerNaturalWidth;

    let childBox = new Clutter.ActorBox();

    childBox.y1 = 0;
    childBox.y2 = allocHeight;
    if (this.actor.get_text_direction() == Clutter.TextDirection.RTL) {
        childBox.x1 = allocWidth - Math.min(Math.floor(sideWidth), leftNaturalWidth);
        childBox.x2 = allocWidth;
    } else {
        childBox.x1 = 0;
        childBox.x2 = Math.min(Math.floor(sideWidth), leftNaturalWidth);
    }
    this._leftBox.allocate(childBox, flags);

    childBox.y1 = 0;
    childBox.y2 = allocHeight;
    if (this.actor.get_text_direction() == Clutter.TextDirection.RTL) {
        childBox.x1 = rightNaturalWidth;
        childBox.x2 = childBox.x1 + centerNaturalWidth;
    } else {
        childBox.x1 = allocWidth - centerNaturalWidth - rightNaturalWidth;
        childBox.x2 = childBox.x1 + centerNaturalWidth;
    }
    this._centerBox.allocate(childBox, flags);

    childBox.y1 = 0;
    childBox.y2 = allocHeight;
    if (this.actor.get_text_direction() == Clutter.TextDirection.RTL) {
        childBox.x1 = 0;
        childBox.x2 = rightNaturalWidth;
    } else {
        childBox.x1 = allocWidth - rightNaturalWidth;
        childBox.x2 = allocWidth;
    }
    this._rightBox.allocate(childBox, flags);

    let [leftCornerMinWidth, leftCornerWidth] = this._leftCorner.actor.get_preferred_width(-1);
    let [leftcornerMinHeight, leftCornerHeight] = this._leftCorner.actor.get_preferred_width(-1);
    childBox.x1 = 0;
    childBox.x2 = leftCornerWidth;
    childBox.y1 = allocHeight;
    childBox.y2 = allocHeight + leftCornerHeight;
    this._leftCorner.actor.allocate(childBox, flags);

    let [rightCornerMinWidth, rightCornerWidth] = this._rightCorner.actor.get_preferred_width(-1);
    let [rightCornerMinHeight, rightCornerHeight] = this._rightCorner.actor.get_preferred_width(-1);
    childBox.x1 = allocWidth - rightCornerWidth;
    childBox.x2 = allocWidth;
    childBox.y1 = allocHeight;
    childBox.y2 = allocHeight + rightCornerHeight;
    this._rightCorner.actor.allocate(childBox, flags);
}

function init() {
    panel = Main.panel;
}

function enable() {
    panel.__proto__[Gi.hook_up_vfunc_symbol]('allocate',
                                             vfunc_allocate);
}

function disable() {
    panel.__proto__[Gi.hook_up_vfunc_symbol]('allocate',
                                             panel.__proto__.vfunc_allocate);
}
