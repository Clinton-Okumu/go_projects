package main

import "fmt"

func main() {
	var name string = "Clint Okumu"
	fmt.Printf("Hello my name is %s\n", name)

	age := 23
	fmt.Printf("My age is %d\n", age)

	if age > 18 {
		fmt.Println("You are old enough to vote")
	} else if age >= 15 {
		fmt.Println("You can register but you can't vote")
	} else {
		fmt.Println("You are too young to vote and register")
	}

	day := "Monday"

	switch day {
	case "Monday":
		fmt.Println("It's Monday")
	case "Tuesday", "Wednesday", "Thursday":
		fmt.Println("It's a weekday")
	default:
		fmt.Println("It's not a weekday")
	}

	for i := 0; i < 5; i++ {
		fmt.Println("this is i", i)
	}

	counter := 0
	for counter < 3 {
		fmt.Println("this is counter", counter)
		counter++
	}

	// array and slices
	number := [5]int{23, 45, 5, 67, 78}
	fmt.Printf("this is our array %v\n", number)

	//allNumber := number[:]
	//firstThree := number[0:3]

	fruits := []string{"apple", "banana", "cherry"}
	fmt.Printf("this are aour fruits %v\n", fruits)

	fruits = append(fruits, "durian")
	fmt.Printf("this are aour fruits %v\n", fruits)

	capitalCities := map[string]string{
		"Kenya":     "Nairobi",
		"United States": "Washington DC",
		"Brazil":    "Brasilia",
		"India":     "New Delhi",
		"Russia":    "Moscow",
		"China":     "Beijing",
		"Japan":     "Tokyo",
	}

}
