import { createActions, createReducer } from 'reduxsauce'
import Immutable from 'seamless-immutable'
import _ from 'lodash'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  setConfiguration: ['response'],
  resetConfiguration: null
})

export const ConfigurationTypes = Types
export default Creators

export const INITIAL_STATE = Immutable({
  configuration: null,
  home: null,
  onboarding: null,
  experiences: [],
  categories: [],
  aboutUrl: '',
  termsUrl: ''
})

export const setConfiguration = (state, { response }) => {
  // flatten experience to make search easier
  let experiences = [];
  response.Configuration.explore.map(explore => {
    explore.experience.map(experience => {
      experiences.push({
        explore_id: explore.id,
        explore_name: explore.name,
        experience_id: experience.id,
        experience_name: experience.name
      });
    });
  });
  // flatten categories to make search easier
  let categories = [];
  const recursive = data => {
    const subCategories = data.category;
    delete data.category;
    categories.push(data);
    if (subCategories != null) {
      subCategories.map(item => {
        recursive(item);
      });
    }
  };
  
  const categorySource = _.cloneDeep(response.Home.categories)
  categorySource.map(category => {
    recursive(category);
  });
  
  return state.merge({
    configuration: response.Configuration,
    home: response.Home,
    onboarding: response.Onboarding,
    experiences,
    categories,

  })
}

export const resetConfiguration = state => INITIAL_STATE

export const reducer = createReducer(INITIAL_STATE, {
  [Types.SET_CONFIGURATION]: setConfiguration,
  [Types.RESET_CONFIGURATION]: resetConfiguration
})