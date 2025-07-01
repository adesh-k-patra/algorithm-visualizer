import { AlgorithmVisualizer } from "./components/AlgorithmVisualizer"
import {
  ObjectGraph,
  ObjectGraphVisualization,
  RenderTrace,
} from "./components/RenderTrace"

const code = `var person = {
  name: "Alice",
  age: 25,
  address: {
    city: "New York",
    zip: "10001"
  }
};

// Step 1
person.age = 26;

// Step 2
person.address.city = "Los Angeles";

// Step 3
person.email = "alice@example.com";

// Step 4
delete person.address.zip;

// Step 5
person.hobbies = ["reading", "traveling"];
`

function App() {
  return (
    <div className="w-full h-screen">
      <AlgorithmVisualizer />
      <RenderTrace code={code} selectedVariable="person" interval={3000} />
    </div>
  )
  // return (

  // )
}

export default App
