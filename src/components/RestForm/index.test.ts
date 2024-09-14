import { describe, expect, it } from 'vitest';

import * as RestForm from './RestForm';
import ReExportedRestForm from './index';

describe('index.ts re-export', () => {
  it('should re-export Card as default', () => {
    expect(ReExportedRestForm).toBe(RestForm.default);
  });
});
