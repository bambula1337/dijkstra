type TGraph = Record<string, Record<string, number>> &
  {start: Record<string, number>} &
  {finish: Record<string, number>}
type TCosts = Record<string, number>
type TParents = Record<string, null | string>
type TProceed = Record<string, boolean>

/**
 *
 * @param _graph Graph that you use, it's required to have specified 'start' and 'finish' keys. Example of graph - "{
 *   start: { A: 5, B: 2 },
 *   A: { C: 4, D: 2 },
 *   B: { A: 8, D: 7 },
 *   C: { D: 6, finish: 3 },
 *   D: { finish: 1 },
 *   finish: {},
 * }"
 * @param _onlyFinalCost Default is false, specify true if you want to just get the number of cost to the "finish". Will return Infinity if there is no way to the "finish"
 */
export function dijkstra (_graph: TGraph, _onlyFinalCost = false): TCosts | number {

  const costs: TCosts  = { ..._graph.start, finish: Infinity };
  const parents: TParents = { finish: null };
  Object.keys(_graph.start).forEach((_key)=> {
    parents[_key] =  'start'
  })
  const processed: TProceed = {};

  let node = getLowestCostNode();
  while (node) {
    const cost = costs[node];
    const children = _graph[node];

    Object.entries(children).forEach(([_childNode, _childCost]) => {
      const newCost = cost + _childCost;
      if (!costs[_childNode] || costs[_childNode] > newCost) {
        costs[_childNode] = newCost;
        parents[_childNode] = node;
      }
    });

    processed[node] = true;
    node = getLowestCostNode();
  }

  function getLowestCostNode(): null | string {
    return Object.keys(costs).reduce((acc: string | null, next: string) => {
      if (acc === null || costs[next] < costs[acc]) {
        if (!processed[next]) {
          acc = next;
        }
      }
      return acc;
    }, null);
  }

  if(_onlyFinalCost){
    return _graph['finish']
  } else {
    return costs
  }
}
