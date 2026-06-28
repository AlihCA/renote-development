const primary = "#B43BD1"

export const renoteClerkAppearance = {
  elements: {
    card: "bg-transparent shadow-none",
    cardBox:
      "w-full overflow-hidden rounded-[2rem] border border-[#E9C8F2]/90 bg-white/95 shadow-[0_24px_70px_rgb(75_29_103_/_18%)] backdrop-blur-xl dark:border-primary/25 dark:bg-card/95",
    footer: "bg-transparent px-6 pb-6",
    footerActionLink: "font-semibold text-[#B43BD1] hover:text-[#9F2CC2]",
    formButtonPrimary:
      "renote-gradient-button border-0 text-sm font-semibold shadow-sm hover:text-white",
    formFieldInput:
      "rounded-2xl border-[#E9C8F2] bg-white/95 shadow-none focus:border-[#B43BD1] focus:ring-[#B43BD1]/25",
    formFieldLabel: "text-sm font-medium text-[#35233F]",
    header: "px-6 pt-6 text-center",
    headerSubtitle: "text-sm leading-6 text-[#6B5A72]",
    headerTitle: "text-2xl font-semibold tracking-tight text-[#251B33]",
    rootBox: "w-full",
    socialButtonsBlockButton:
      "rounded-2xl border-[#E9C8F2] bg-white/90 text-[#35233F] shadow-none hover:bg-[#FFF7FD]",
  },
  variables: {
    borderRadius: "1.25rem",
    colorBackground: "rgba(255, 255, 255, 0.92)",
    colorInputBackground: "#FFFFFF",
    colorInputText: "#251B33",
    colorPrimary: primary,
    colorText: "#251B33",
    colorTextSecondary: "#6B5A72",
    fontFamily: '"Inter Variable", Inter, ui-sans-serif, system-ui, sans-serif',
  },
}

export const renoteUserButtonAppearance = {
  elements: {
    avatarBox:
      "size-9 rounded-2xl ring-1 ring-[#E9C8F2] ring-offset-2 ring-offset-background",

    userButtonPopoverCard:
      "rounded-3xl border border-[#E9C8F2] bg-white shadow-xl shadow-fuchsia-950/10",

    userButtonPopoverActionButton:
      "rounded-2xl !text-[#35233F] hover:!bg-[#FFF7FD] hover:!text-[#B43BD1] [&_span]:!text-[#35233F] [&_svg]:!text-[#B43BD1]",

    userButtonPopoverActionButtonText:
      "!font-medium !text-[#35233F]",

    userButtonPopoverActionButtonIcon:
      "!text-[#B43BD1]",

    userPreviewMainIdentifier:
      "!font-semibold !text-[#251B33]",

    userPreviewSecondaryIdentifier:
      "!text-[#6B5A72]",

    userButtonPopoverFooter: "hidden",
  },
  variables: {
    colorPrimary: "#B43BD1",
    colorText: "#251B33",
    colorTextSecondary: "#6B5A72",
    colorNeutral: "#6B5A72",
    colorDanger: "#9F2CC2",
    borderRadius: "1rem",
    fontFamily: '"Inter Variable", Inter, ui-sans-serif, system-ui, sans-serif',
  },
}
