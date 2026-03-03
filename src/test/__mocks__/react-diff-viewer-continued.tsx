export default function ReactDiffViewer(props: any) {
  return (
    <div data-testid="diff-viewer">
      {props.renderHunkHeader && props.renderHunkHeader({
        hunk: { content: 'mock-hunk' },
        patch: 'mock-patch'
      })}
    </div>
  );
}
