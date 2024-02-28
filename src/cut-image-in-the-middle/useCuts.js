import { useReducer } from 'react';
import _ from 'lodash';

const actions = {
  remove: 'remove',
  add: 'add',
  update: 'update',
  clear: 'clear',
};

const initialState = {
  sortedIds: [],
  store: {},
  idCounter: 0,
};

function removeCut(state, cutId) {
  const cut = state.store[cutId];
  if (cut) {
    const i = state.sortedIds.findIndex(id => id === cutId);
    return {
      ...state,
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
    const nextStore = {
      ...store,
      [id]: cut,
    };
    const insertTargetIndex = _.sortedIndexBy(
      sortedIds,
      id => nextStore[id].top
    );
    return {
      ...state,
      sortedIds: [
        ...sortedIds.slice(0, insertTargetIndex),
        id,
        ...sortedIds.slice(insertTargetIndex),
      ],
      store: nextStore,
    };
  }
  return {
    ...state,
    sortedIds: [cut.id],
    store: { [cut.id]: cut },
  };
}

function cutsReducer(state, action) {
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
      const nextId = state.idCounter + 1;
      const cut = {
        id: `${nextId}`,
        ...action.props,
      };
      return {
        ...addCut(state, cut),
        idCounter: nextId,
      };
    }
    case actions.clear: {
      return initialState;
    }
    default: {
      return state;
    }
  }
}

export default function useCuts() {
  const [state, dispatch] = useReducer(cutsReducer, initialState);
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
    clear: () => {
      dispatch({ type: actions.clear });
    },
  };
}
