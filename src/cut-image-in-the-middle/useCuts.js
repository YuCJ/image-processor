import { useReducer } from 'react';
import _ from 'lodash';

const actions = {
  remove: 'remove',
  add: 'add',
  update: 'update',
};

const initialState = {
  sortedIds: [],
  store: {},
};

function removeCut(state, cutId) {
  const cut = state.store[cutId];
  if (cut) {
    const i = state.sortedIds.findIndex(id => id === cutId);
    return {
      sortedIds: [
        ...state.sortedIds.slice(0, i),
        ...state.sortedIds.slice(i + 1),
      ],
      store: _.omit(state.store, cutId),
    };
  }
  return state;
}

function addCut(state, cut) {
  const { sortedIds, store } = state;
  const { id } = cut;
  if (sortedIds.length > 0) {
    const insertTargetIndex = _.sortedIndexBy(sortedIds, id => store[id].top);
    return {
      sortedIds: [
        ...sortedIds.slice(0, insertTargetIndex),
        id,
        ...sortedIds.slice(insertTargetIndex),
      ],
      store: {
        ...store,
        [id]: cut,
      },
    };
  }
  return {
    sortedIds: [cut.id],
    store: { [cut.id]: cut },
  };
}

function cutsReducer(state = initialState, action) {
  let id = 0;
  switch (action?.type) {
    case actions.update: {
      const cut = {
        id: action.id,
        ...state.store[action.id],
        ...action.props,
      };
      return addCut(removeCut(state, action.id), cut);
    }
    case actions.remove: {
      return removeCut(state, action.id);
    }
    case actions.add: {
      id += 1;
      const cut = {
        id,
        ...action.props,
      };
      return addCut(state, cut);
    }
    default: {
      return state;
    }
  }
}

export default function useCuts() {
  const [state, dispatch] = useReducer(cutsReducer);
  return {
    cuts: state.store,
    sortedIds: state.sortedIds,
    add: props => {
      dispatch({ type: actions.add, props });
    },
    remove: id => {
      dispatch({ type: actions.remove, id });
    },
    update: (id, props) => {
      dispatch({ type: actions.update, id, props });
    },
  };
}
