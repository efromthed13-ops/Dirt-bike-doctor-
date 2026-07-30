import symptoms from '../data/symptom_keywords.json';

export function diagnose(problem) {
  const text = problem.toLowerCase();
  const matches = Object.keys(symptoms.keywords).filter(key => text.includes(key));

  return matches.map(key => ({
    symptom: key,
    possibleCauses: symptoms.keywords[key]
  }));
}
