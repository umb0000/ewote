import test from 'node:test';
import assert from 'node:assert/strict';
import { filterProjects } from '../lib/filter.mjs';
const projects = [{slug:'a',tags:['VIDEO','ART DIRECTION']},{slug:'b',tags:['BRANDING']}];
test('ALL restores every project in original order',()=>assert.deepEqual(filterProjects(projects,'ALL'), projects));
test('a tag selects only matching projects',()=>assert.deepEqual(filterProjects(projects,'VIDEO'),[projects[0]]));
test('unmatched tags produce an empty list',()=>assert.deepEqual(filterProjects(projects,'PHOTO'),[]));
