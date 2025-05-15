package main

import "fmt"

type Person struct {
	Name string
	Age  int
}

type Address struct {
	Street string
	City   string
}

type Contact struct {
	Name    string
	Address Address
}

func main() {
	person := Person{Name: "Clint Okumu", Age: 30}
	fmt.Printf("This person is %+v\n", person)

	// anonymous struct
	employee := struct {
		name string
		age  int
	}{
		name: "Clint Okumu",
		age:  30,
	}

	fmt.Println(employee)

	contact := Contact{
		Name: "Jason",
		Address: Address{
			Street: "Block 10",
			City:   "Ruai",
		},
	}

	fmt.Println("this is contact", contact)
	fmt.Println("this is employee", employee)

	x := 20
	ptr := &x
	fmt.Printf("The value of x is: %d and the address of x is %p\n", x, ptr)
	*ptr = 56
	fmt.Printf("The new value of x is %d and the address of x is %p\n", x, ptr)
}
