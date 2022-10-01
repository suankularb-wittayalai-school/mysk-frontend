// External libraries
import { Component, FunctionComponent, ReactNode } from "react";

class ErrorBoundary extends Component<
  { Fallback: FunctionComponent<{ error: Error }>; children?: ReactNode },
  { error: Error | null }
> {
  public state = { error: null };

  public static getDerivedStateFromError(error: Error): {
    error: Error | null;
  } {
    return { error };
  }

  public componentDidCatch(error: Error) {
    console.error(error);
  }

  public render() {
    if (this.state.error)
      return <this.props.Fallback error={this.state.error} />;
    return this.props.children;
  }
}

export default ErrorBoundary;
