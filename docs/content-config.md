# Content configuration

Owner-supplied facts are centralized in `apps/storefront/src/config/site.js`.

| Key                                            | Owner input | Site behavior                                   |
| ---------------------------------------------- | ----------- | ----------------------------------------------- |
| `heroHeadline`                                 | OI-011      | Hero heading                                    |
| `sourcingRegion`                               | OI-001      | Adds region content when set                    |
| `certifications`                               | OI-002      | Shows certification content only when non-empty |
| `fssaiLicenceNo`                               | OI-003      | Shows the licence number only when set          |
| `announcementMessage`                          | OI-006      | Shows the announcement bar only when set        |
| `freeShippingThreshold`                        | OI-006      | Enables threshold copy when set                 |
| `returnsPolicy`                                | OI-006      | Enables return content when enabled             |
| `supportEmail`, `supportPhone`, `supportHours` | OI-013      | Shows configured contact details                |
| `batchLabel`                                   | OI-015      | Shows a batch label only when set               |
| `newsletterEnabled`                            | OI-006      | Controls newsletter UI                          |
| `domain`                                       | OI-010      | Reserved for launch metadata                    |
