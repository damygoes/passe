'use client'

import { LocaleDropdownMenu } from '@/components/shared/LocaleDropdownMenu'
import { ThemeDropdownMenu } from '@/components/shared/ThemeDropdownMenu'
import { routes } from '@/lib/routes'
import { Button } from '@passe/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@passe/ui/dropdown-menu'
import { Icon } from '@passe/ui/icon'
import { useTranslations } from 'next-intl'
import { ANCHOR_LINKS } from '../constants'
import { ExitLink } from './ExitLink'

/**
 * Everything the header drops below `lg`: the section anchors, sign-in, and the
 * language/theme switchers. A dropdown rather than a full-screen overlay on purpose —
 * `DropdownMenuContent` portals to the body, so it escapes the containing block the
 * navbar's `backdrop-blur` creates, which would otherwise trap a `fixed inset-0` panel
 * at the navbar's own height.
 */
export function LandingNavMenu({ className }: { className?: string }) {
  const t = useTranslations('landing.nav')
  const tNav = useTranslations('nav')

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="outline"
            size="icon"
            icon="menu"
            aria-label={t('menu')}
            className={className}
          />
        }
      />

      {/* Content defaults to the trigger's width — 32px here, so it needs an explicit one. */}
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuGroup>
          {ANCHOR_LINKS.map(({ key, href }) => (
            // Real anchors, not onClick handlers — same-page jumps stay middle-clickable
            // and the menu closes itself on select.
            <DropdownMenuItem key={key} render={<a href={href} />}>
              {t(key)}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* ExitLink, so sign-in plays the landing exit transition here too. */}
        <DropdownMenuItem render={<ExitLink href={routes.signIn} />}>
          <Icon name="user" size="sm" />
          {t('sign_in')}
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Icon name="languages" />
              {tNav('language')}
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuGroup>
                  <LocaleDropdownMenu variant="sidebar-menu" />
                </DropdownMenuGroup>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>

          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Icon name="palette" />
              {tNav('theme')}
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuGroup>
                  <DropdownMenuLabel>{tNav('appearance')}</DropdownMenuLabel>
                  <ThemeDropdownMenu variant="sidebar-menu" />
                </DropdownMenuGroup>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
