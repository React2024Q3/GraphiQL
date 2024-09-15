import { describe, expect, it } from 'vitest';

import * as RDTGraphiQLForm from './RDTGraphiQLForm';
import ReExportedRDTGraphiQLForm from './index';

describe('index.ts re-export', () => {
  it('should re-export Card as default', () => {
    expect(ReExportedRDTGraphiQLForm).toBe(RDTGraphiQLForm.default);
  });
});
