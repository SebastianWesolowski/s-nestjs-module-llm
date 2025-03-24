export const maybeSnapshot = (container: HTMLElement): void => {
  if (process.env['TEST_WITH_SNAPSHOTS']) {
    expect(container).toMatchSnapshot();
  }
};
