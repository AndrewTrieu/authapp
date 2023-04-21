const showHome = async ({ state, render }) => {
  const user = await state.session.get("user");
  render("index.eta", user);
};

export { showHome };
