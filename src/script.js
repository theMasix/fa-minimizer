const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});

// Declare and initialize some vars

// the automaton we get from input
let automaton;
// Our final minimum-state automation (minimized version)
let MSAutomation = {};
// Our SM object (dictionary)
// Keys are`Qi,Qj` pair of nodes and values are alwayes true
let SM = {};
// groups of node which will be created from SM
let nodeGroups = [];

// wrapper of our utility functions
const utils = {};

// tells if an unordered pair of nodes are in SM or not
utils.existInSet = (node1, node2) => {
  const str1 = `${node1},${node2}`;
  const str2 = `${node2},${node1}`;
  if (str1 in SM || str2 in SM) return true;
  return false;
};

// add pair of nodes to SM
utils.addToSet = (node1, node2) => {
  const str = `${node1},${node2}`;
  SM[str] = true;
};

// Return index of group in which the specific node is in it
utils.findNodeInGroups = (nodeName) => {
  for (let groupIndex in nodeGroups) {
    const nodeIndex = nodeGroups[groupIndex].indexOf(nodeName);
    if (nodeIndex !== -1) return groupIndex;
  }
  return -1;
};

// add a node to an existing group
utils.addNodeToGroup = (index, nodeName) => {
  nodeGroups[index].push(nodeName);
};

// Algorithm can be found in Page 75 of Martin Book
utils.createSM = () => {
  // Add basis of the recurstion to the SM
  Object.entries(automaton).map((entry1) => {
    Object.entries(automaton).map((entry2) => {
      const [name1, value1] = entry1;
      const [name2, value2] = entry2;
      if (utils.existInSet(name1, name2)) return;
      if (
        (value1.acceptance && !value2.acceptance) ||
        (!value1.acceptance && value2.acceptance)
      ) {
        utils.addToSet(name1, name2);
      }
    });
  });

  // Run the recursion
  let isFinished = false;

  // run until we have no change in our set in an iteration
  while (!isFinished) {
    isFinished = true;
    Object.entries(automaton).map((entry1) => {
      Object.entries(automaton).map((entry2) => {
        // Extract names and values
        const [name1, value1] = entry1;
        const [name2, value2] = entry2;

        Object.keys(value2.adjacency).map((word) => {
          // Extract target node
          const node1 = value1.adjacency[word];
          const node2 = value2.adjacency[word];

          if (
            utils.existInSet(node1, node2) &&
            !utils.existInSet(name1, name2)
          ) {
            // If the targets are in SM but not current node themself

            // so we have on change in our SM in this iteration
            isFinished = false;
            utils.addToSet(name1, name2);
          }
        });
      });
    });
  }

  // Now our SM dictionary is complete!
};

// Algorithm can be found in Page 75 of Martin Book
utils.createNodeGroups = () => {
  // Make name of nodes based on their count
  const nodeCount = Object.keys(automaton).length;

  // first, we push q0 as a new node
  nodeGroups.push(['q0']);

  for (let i = 1; i < nodeCount; i++) {
    let isNewNode = true;
    for (let j = 0; j < i; j++) {
      if (!utils.existInSet(`q${i}`, `q${j}`)) {
        // Then qi and qj should be combined
        isNewNode = false;
        const qjIndex = utils.findNodeInGroups(`q${j}`);
        utils.addNodeToGroup(qjIndex, `q${i}`);
        break;
      }
    }
    if (isNewNode) nodeGroups.push([`q${i}`]);
  }
};

utils.getNewNodeName = (nodeName) => {
  const groupIndex = utils.findNodeInGroups(nodeName);
  return nodeGroups[groupIndex].reduce((name, aNode) => {
    return `${name}${aNode}`;
  });
};

utils.createNewFA = () => {
  for (let group of nodeGroups) {
    const oneOfGroupNode = group[0];
    const newNodeName = utils.getNewNodeName(oneOfGroupNode);

    // First, copy the whole node details
    const newNodeValue = automaton[oneOfGroupNode];

    // Create new object to hold new adjacency
    const newAdjacency = {};

    // fill the newAdjacency
    Object.keys(newNodeValue.adjacency).map((word) => {
      newAdjacency[word] = utils.getNewNodeName(newNodeValue.adjacency[word]);
    });

    // Replace newAdjacency with old adjacency
    newNodeValue.adjacency = newAdjacency;

    // Save the newNode value
    MSAutomation[newNodeName] = newNodeValue;
  }
};

utils.run = (line) => {
  // Parse JSON so we can read it
  automaton = JSON.parse(line);

  // Create SM object completely
  utils.createSM();

  // Create Node Groups based on created SM
  utils.createNodeGroups();

  // Create new Finite Automaton based on created node groupd
  utils.createNewFA();

  // Hooray! we now have minimum-state automaton. Print it!
  console.log(JSON.stringify(MSAutomation));
};

// Get input as string
rl.on('line', async (line) => {
  try {
    // Run the program
    utils.run(line);
  } catch (e) {
    console.log(e.message);
  }
});
