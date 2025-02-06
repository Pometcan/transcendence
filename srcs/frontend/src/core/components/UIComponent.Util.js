export function withTransitions( component, transitions ) {
  component.transitionIn = () => transitions.in( component );
  component.transitionOut = () => transitions.out( component );
  return component;
}

export function withEventHandlers( component, events ) {
  for ( const [event, handler] of Object.entries( events ) ) {
    if (component[event]) {
      component.removeEventListener(event);
    }
    component.addEventListener(event, handler);
  }
  return component;
}
