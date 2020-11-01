# Finite Automaton Minimizer

An script which reads a valid FA as JSON from standard input and print the minimized FA to the output.

## Algorithm

I implemented the algorithm that is provided in 2.6 section of "[Introduction to Languages and the Theory of Computation 4th edition](https://www.amazon.com/Introduction-Languages-Theory-Computation-Martin/dp/0073191469)"

## Motivation

This script has written for an asignment of my "Introduction of Theory of Computation" course in university

## Structure of the Input and Output JSON file

```json
{
  "<node_name>": {
    "adjacency": {
      "<edge_name>": "<node_name>",
      "<edge_name>": "<node_name>"
    },
    "acceptance": true
  },
  "<node_name>": {
    "adjacency": {
      "<edge_name>": "<node_name>",
      "<edge_name>": "<node_name>"
    },
    "acceptance": false
  }
}
```

### Examples

> **_Important Note:_** This examples are the beautified version of them. script only reads inputs and prints output in one-line! So inputs should be stringify and then pass to script. [An example](https://github.com/theMasix/fa-minimizer/blob/main/src/script.01.inp) can be found in the source code and you can use it via [IO Run](https://marketplace.visualstudio.com/items?itemName=hoangnc.io-run) Extenstion in VSCode.

#### Example 1

Input

```json
{
  "q0": {
    "acceptance": true,
    "adjacency": {
      "a": "q1",
      "b": "q1"
    }
  },
  "q1": {
    "acceptance": true,
    "adjacency": {
      "a": "q0",
      "b": "q0"
    }
  }
}
```

Output

```json
{
  "q0q1": {
    "acceptance": true,
    "adjacency": {
      "a": "q0q1",
      "b": "q0q1"
    }
  }
}
```

#### Example 2

> This example can be found in Page 76 of "[Introduction to Languages and the Theory of Computation 4th edition](https://www.amazon.com/Introduction-Languages-Theory-Computation-Martin/dp/0073191469)" by John C. Martin

Input

```json
{
  "q0": {
    "acceptance": false,
    "adjacency": {
      "a": "q1",
      "b": "q9"
    }
  },
  "q1": {
    "acceptance": false,
    "adjacency": {
      "a": "q8",
      "b": "q2"
    }
  },
  "q2": {
    "acceptance": false,
    "adjacency": {
      "a": "q3",
      "b": "q2"
    }
  },
  "q3": {
    "acceptance": true,
    "adjacency": {
      "a": "q2",
      "b": "q4"
    }
  },
  "q4": {
    "acceptance": true,
    "adjacency": {
      "a": "q5",
      "b": "q8"
    }
  },
  "q5": {
    "acceptance": false,
    "adjacency": {
      "a": "q4",
      "b": "q5"
    }
  },
  "q6": {
    "acceptance": false,
    "adjacency": {
      "a": "q7",
      "b": "q5"
    }
  },
  "q7": {
    "acceptance": false,
    "adjacency": {
      "a": "q6",
      "b": "q5"
    }
  },
  "q8": {
    "acceptance": true,
    "adjacency": {
      "a": "q1",
      "b": "q3"
    }
  },
  "q9": {
    "acceptance": true,
    "adjacency": {
      "a": "q7",
      "b": "q8"
    }
  }
}
```

Output

```json
{
  "q0": {
    "acceptance": false,
    "adjacency": {
      "a": "q1q2q5",
      "b": "q9"
    }
  },
  "q1q2q5": {
    "acceptance": false,
    "adjacency": {
      "a": "q3q4q8",
      "b": "q1q2q5"
    }
  },
  "q3q4q8": {
    "acceptance": true,
    "adjacency": {
      "a": "q1q2q5",
      "b": "q3q4q8"
    }
  },
  "q6q7": {
    "acceptance": false,
    "adjacency": {
      "a": "q6q7",
      "b": "q1q2q5"
    }
  },
  "q9": {
    "acceptance": true,
    "adjacency": {
      "a": "q6q7",
      "b": "q3q4q8"
    }
  }
}
```

---

Code released under the [MIT License](http://github.com/themasix/fa-minimizer/blob/master/LICENSE).
