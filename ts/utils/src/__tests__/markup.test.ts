import { paragrapher, parseMarkup } from '../markup';

describe('Markup', () => {
  describe('parser', () => {
    it('parses plain text', () => {
      expect(
        parseMarkup(
          'Elit aute laboris consectetur Lorem. Eu non eiusmod deserunt elit elit nulla ea Lorem nisi non proident et. Occaecat eu incididunt non esse esse aute excepteur. Officia incididunt occaecat nulla amet.\nDeserunt et duis nostrud exercitation laboris dolor ad ullamco deserunt. Exercitation eiusmod exercitation anim occaecat duis. Sunt anim anim velit minim ea incididunt et.',
        ),
      ).toEqual([
        'Elit aute laboris consectetur Lorem. Eu non eiusmod deserunt elit elit nulla ea Lorem nisi non proident et. Occaecat eu incididunt non esse esse aute excepteur. Officia incididunt occaecat nulla amet.\nDeserunt et duis nostrud exercitation laboris dolor ad ullamco deserunt. Exercitation eiusmod exercitation anim occaecat duis. Sunt anim anim velit minim ea incididunt et.',
      ]);
    });

    it('parses markup', () => {
      expect(
        parseMarkup(
          '<color="red">foo</color> something <link="/foo">link <color="blue">stuff</color></link> and <link="/foo?something=true">link with params</link> or <bold>without attribute</bold>',
        ),
      ).toEqual([
        {
          attribute: 'red',
          children: ['foo'],
          tag: 'color',
        },
        ' something ',
        {
          attribute: '/foo',
          children: [
            'link ',
            {
              attribute: 'blue',
              children: ['stuff'],
              tag: 'color',
            },
          ],
          tag: 'link',
        },
        ' and ',
        {
          attribute: '/foo?something=true',
          children: ['link with params'],
          tag: 'link',
        },
        ' or ',
        {
          attribute: undefined,
          children: ['without attribute'],
          tag: 'bold',
        },
      ]);
    });

    it('trows an error when bad markup', () => {
      const mockFn = jest.fn(() =>
        parseMarkup(
          '<color="red">foo</link> something <link="/foo"><color="blue">stuff</color></link>',
        ),
      );

      expect(mockFn).toThrow(Error('Unexpected closing tag link'));
    });
  });

  describe('paragrapher', () => {
    it('wraps text with paragraphs tag', () => {
      expect(
        paragrapher(
          'Nostrud et nostrud exercitation pariatur consectetur elit ad elit sunt laborum.',
        ),
      ).toBe(
        '<paragraph>Nostrud et nostrud exercitation pariatur consectetur elit ad elit sunt laborum.</paragraph>',
      );
    });

    it('wraps line break text to multiple parahraps', () => {
      expect(
        paragrapher(
          'Irure qui ad culpa id. Ea in ea id mollit est sint laboris cillum pariatur commodo irure culpa nulla Lorem.\nQuis aliqua labore cupidatat minim anim pariatur aliquip eiusmod fugiat ipsum culpa incididunt in adipisicing.  \n\n\nExcepteur non labore deserunt quis dolor esse in sint eiusmod in nulla dolor. \n\n  ',
        ),
      ).toBe(
        '<paragraph>Irure qui ad culpa id. Ea in ea id mollit est sint laboris cillum pariatur commodo irure culpa nulla Lorem.</paragraph><paragraph>Quis aliqua labore cupidatat minim anim pariatur aliquip eiusmod fugiat ipsum culpa incididunt in adipisicing.</paragraph><paragraph>Excepteur non labore deserunt quis dolor esse in sint eiusmod in nulla dolor.</paragraph>',
      );
    });
  });
});
