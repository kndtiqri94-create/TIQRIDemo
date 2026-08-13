import { preventDeadLinkNavigation } from './dead-link.util';

describe('preventDeadLinkNavigation', () => {
  it('calls preventDefault on the given event so no navigation occurs', () => {
    const event = new Event('click');
    const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

    preventDeadLinkNavigation(event);

    expect(preventDefaultSpy).toHaveBeenCalledOnce();
  });
});
