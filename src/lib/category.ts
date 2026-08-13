// The only category shown on the public site right now. Cars in other
// categories stay in the database (visible/editable in /admin) but are
// filtered out of every public-facing query. Bump this by hand once ready
// to switch which batch of ~200 cars is live — the full automatic 5-week
// rotation isn't built yet, this is the manual first step.
export const ACTIVE_CATEGORY = 1;
