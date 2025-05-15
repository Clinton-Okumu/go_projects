package exercise

import (
	"fmt"
	"slices"
)

type Item struct {
	Name string
	Type string
}

type Player struct {
	Name      string
	Inventory []Item
}

func (p *Player) PickUp(item Item) {
	p.Inventory = append(p.Inventory, item)
	fmt.Printf("%s picked up %s\n", p.Name, item.Name)
}

func (p *Player) DropItem(item Item) {
	for i, invItem := range p.Inventory {
		if invItem.Name == item.Name {
			p.Inventory = slices.Delete(p.Inventory, i, i+1)
			fmt.Printf("%s dropped %s\n", p.Name, item.Name)
			return
		}
	}
	fmt.Printf("%s doesn't have %s\n", p.Name, item.Name)
}

func (p *Player) UseItem(itemName string) {
	for i, item := range p.Inventory {
		if item.Name == itemName {
			fmt.Printf("%s used %s\n", p.Name, item.Name)
			p.Inventory = slices.Delete(p.Inventory, i, i+1)
			return
		}
	}
}
